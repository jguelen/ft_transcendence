import React, { useState, useEffect, useCallback } from "react";
import FriendScrollableList from "./Friend";
import useAuth from "../context/AuthContext"

export type FriendStatus = "ami" | "random" | "bloqué" | "blockedby";
export interface FriendItem {
name: string;
id: number;
status?: FriendStatus;
requestType?: "received" | "sent";
}

type FriendType = "notFriend" | "requests" | "friends" | "blocked";

async function fetchBlockedBy(userId: number, allUsers: FriendItem[]): Promise<FriendItem[]> {
// Pour chaque user, on teste s’il a bloqué l’utilisateur courant
const blockedBy: FriendItem[] = [];
await Promise.all(
	allUsers.map(async (u : any) => {
	if (u.id === userId) return;
	const res = await fetch(`/api/user/getrelationship/${u.id}`, { credentials: "include" });
	if (res.ok) {
		const rel = await res.json();
		if (rel.hasblockedyou) {
		blockedBy.push({ ...u, status: "blockedby" });
		}
	}
	})
);
return blockedBy;
}

function makeList(
setRandomList : any,
setFriendList : any,
setRequestByList : any,
setYouRequestList : any,
setBlockedByList : any,
setYouBlockedList : any,
setLoading : any
) {
setLoading(true);
Promise.all([
	fetch("/api/user/getloggeduser", { credentials: "include" }).then((r : any) => r.json()),
	fetch("/api/user/all", { credentials: "include" }).then((r : any) => r.json()),
	fetch("/api/user/getfriends", { credentials: "include" }).then((r : any) => r.json()),
	fetch("/api/user/getfriendshiprequests", { credentials: "include" }).then((r : any) => r.json()),
	fetch("/api/user/getyourfriendshiprequests", { credentials: "include" }).then((r : any) => r.json()),
	fetch("/api/user/getblockeds", { credentials: "include" }).then((r : any) => r.json()),
])
	.then(async ([currentUser, allUsers, friends, requestsBy, youRequests, youBlocked]) => {
	const myId = currentUser.id;
	const friendIds = new Set(friends.map((f : any) => f.id));
	const youBlockedIds = new Set(youBlocked.map((f : any) => f.id));
	const requestByIds = new Set(requestsBy.map((r : any) => r.requesterId));
	const youRequestIds = new Set(youRequests.map((r : any) => r.requestedId));

	// randomList = tous sauf amis, bloqués, demandes, et soi-même
	const randomList = allUsers
		.filter(
		(u : any) =>
			u.id !== myId &&
			!friendIds.has(u.id) &&
			!youBlockedIds.has(u.id) &&
			!requestByIds.has(u.id) &&
			!youRequestIds.has(u.id)
		)
		.map((u : any) => ({ ...u, status: "random" }));

	setRandomList(randomList);

	setFriendList(friends.map((f : any) => ({ ...f, status: "ami" })));

	// Demandes reçues (requestByList)
	setRequestByList(requestsBy.map((r : any) => ({
		id: r.requesterId,
		name: r.name,
		status: "random",
		requestType: "received"
	})));

	// Demandes envoyées (youRequestList)
	setYouRequestList(youRequests.map((r : any) => ({
		id: r.requestedId,
		name: r.name,
		status: "random",
		requestType: "sent"
	})));

	setYouBlockedList(youBlocked.map((f : any) => ({ ...f, status: "bloqué" })));

	// Bloqués par eux
	const blockedByList = await fetchBlockedBy(myId, allUsers);
	setBlockedByList(blockedByList);

	setLoading(false);
	})
	.catch(() => {
	setRandomList([]);
	setFriendList([]);
	setRequestByList([]);
	setYouRequestList([]);
	setBlockedByList([]);
	setYouBlockedList([]);
	setLoading(false);
	});
}

export default function FriendList() {
	const [randomList, setRandomList] = useState<FriendItem[]>([]);
	const [friendList, setFriendList] = useState<FriendItem[]>([]);
	const [requestByList, setRequestByList] = useState<FriendItem[]>([]);
	const [youRequestList, setYouRequestList] = useState<FriendItem[]>([]);
	const [blockedByList, setBlockedByList] = useState<FriendItem[]>([]);
	const [youBlockedList, setYouBlockedList] = useState<FriendItem[]>([]);
	const [activeTab, setActiveTab] = useState<FriendType>("notFriend");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [friendOnlineStatus, setFriendOnlineStatus] = useState<Record<number, boolean>>({});

	const {wsRef} = useAuth();

	const refreshLists = useCallback(() => {
		makeList(
		setRandomList,
		setFriendList,
		setRequestByList,
		setYouRequestList,
		setBlockedByList,
		setYouBlockedList,
		setIsLoading
		);
	}, []);

	useEffect(() => {
		refreshLists();
	}, [refreshLists]);

	useEffect(() => {
    if (!wsRef.current) return;
    const sendOnlineStatusRequests = () => {
      friendList.forEach((friend :any) => {
        if (wsRef.current?.readyState === 1) {
          wsRef.current.send(JSON.stringify({ type: "getOnlineUser", id: friend.id }));
        } else {
          wsRef.current?.addEventListener('open', () => {
            wsRef.current?.send(JSON.stringify({ type: "getOnlineUser", id: friend.id }));
          });
        }
      });
    };
    sendOnlineStatusRequests();
  }, [friendList, wsRef]);

	useEffect(() => {
		if (!wsRef.current) return;
		wsRef.current.addEventListener("message", (event) => {
			console.log("WebSocket message reçu :", event.data);
		});
	}, []);

	useEffect(() => {
		if (wsRef.current){
			const handleOnlineStatus = (event : any) => {
				try {
					console.log(event);
					const data = JSON.parse(event.data);
					if (data.type === "onlineStatus") {
						setFriendOnlineStatus((statuses : any) => ({
						...statuses,
						[data.id]: data.online
						}));
					}
				} catch (e) {
					console.error(e);
				}
			}

			wsRef.current.addEventListener("message", handleOnlineStatus);
			return () => {
				wsRef.current.removeEventListener("message", handleOnlineStatus);
			};
		}
	}, [wsRef]);

	const handleAddFriend = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/requestfriendship/${id}`, { method: "PUT", credentials: "include" });
		refreshLists();
	};

	const handleRemoveFriend = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/unfriend/${id}`, { method: "DELETE", credentials: "include" });
		refreshLists();
	};

	const handleAcceptRequest = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/acceptfriendshiprequest/${id}`, { method: "PUT", credentials: "include" });
		refreshLists();
	};

	const handleCancelRequest = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/delyourfriendshiprequest/${id}`, { method: "DELETE", credentials: "include" });
		refreshLists();
	};

	const handleDeclineRequest = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/declinefriendshiprequest/${id}`, { method: "PUT", credentials: "include" });
		refreshLists();
	};

	const handleBlock = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/delyourfriendshiprequest/${id}`, { method: "DELETE", credentials: "include" });
		await fetch(`/api/user/unfriend/${id}`, { method: "DELETE", credentials: "include" });
		await fetch(`/api/user/block/${id}`, { method: "PUT", credentials: "include" });
		refreshLists();
	};

	const handleUnblock = async (id: number) => {
		setIsLoading(true);
		await fetch(`/api/user/unblock/${id}`, { method: "DELETE", credentials: "include" });
		refreshLists();
	};

	const tabNames: Record<FriendType, string> = {
		notFriend: "Non amis",
		requests: "Demandes d'amis",
		friends: "Amis",
		blocked: "Bloqués"
	};

	// Fusionne les demandes (envoyées & reçues) pour l’affichage
	const requestsList = [...requestByList, ...youRequestList];
	// Fusionne les bloqués (par toi & par eux) pour l’affichage
	const blockedList = [...blockedByList, ...youBlockedList];

	let currentList: FriendItem[] = [];
	if (activeTab === "notFriend") currentList = randomList;
	if (activeTab === "requests") currentList = requestsList;
	if (activeTab === "friends") currentList = friendList;
	if (activeTab === "blocked") currentList = blockedList;

	return (
		<div className="max-w-xl mx-auto p-4">
		<div className="flex gap-2 mb-4">
			{Object.entries(tabNames).map(([key, label]) => (
			<button
				key={key}
				className={`px-3 py-2 rounded font-semibold border ${
				activeTab === key
					? "bg-blue-500 text-white border-blue-500"
					: "bg-gray-100 text-gray-800 border-gray-300"
				}`}
				onClick={() => setActiveTab(key as FriendType)}
			>
				{label}
			</button>
			))}
		</div>
		<div className="h-96 overflow-y-auto flex flex-col gap-4 bg-white rounded shadow p-2">
			{isLoading ? (
			<div className="text-center text-gray-400 mt-10">Chargement...</div>
			) : currentList.length === 0 ? (
			<div className="text-center text-gray-400 mt-10">Aucun utilisateur</div>
			) : (
			<FriendScrollableList
				items={currentList}
				activeTab={activeTab}
				onAddFriend={handleAddFriend}
				onRemoveFriend={handleRemoveFriend}
				onAcceptRequest={handleAcceptRequest}
				onDeclineRequest={handleDeclineRequest}
				onBlock={handleBlock}
				onUnblock={handleUnblock}
				onCancelRequest={handleCancelRequest}
				friendOnlineStatus={friendOnlineStatus}
			/>
			)}
		</div>
		</div>
	);
}
