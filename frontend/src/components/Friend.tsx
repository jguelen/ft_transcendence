import React from "react";
import clsx from "clsx";
import type { FriendItem } from "./FriendList";
import { t } from "i18next";

interface FriendScrollableListProps {
  items: FriendItem[];
  activeTab: string;
  onAddFriend: (id: number) => void;
  onRemoveFriend: (id: number) => void;
  onAcceptRequest: (id: number) => void;
  onDeclineRequest: (id: number) => void;
  onBlock: (id: number) => void;
  onUnblock: (id: number) => void;
  onCancelRequest: (id: number) => void;
  friendOnlineStatus: Record<number, boolean>;
  youBlockedIds: Set<number>;
  blockedByIds: Set<number>;
}

const FriendScrollableList = ({
  items,
  activeTab,
  onAddFriend,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onBlock,
  onUnblock,
  onCancelRequest,
  friendOnlineStatus,
  youBlockedIds,
  blockedByIds
}: FriendScrollableListProps) => {
  function isBlocked(id: number) {
    return youBlockedIds.has(id) || blockedByIds.has(id);
  }

  return (
    <div className="flex flex-col justify-start items-center w-full h-full gap-3 p-3 overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className={clsx(
            "flex flex-col sm:flex-row justify-between items-center w-full min-h-[79px] border",
            "border-cyan_darkend rounded-small p-2 sm:p-3 bg-blue_darkend",
            "transition-all"
          )}
        >
          <div className="flex flex-col sm:flex-row w-full sm:w-[280px] h-full justify-start items-center gap-2">
            <span
              className={clsx(
                "rounded-small w-full sm:w-[110px] h-[38px] sm:h-[47px]",
                "flex justify-center items-center mb-2 sm:mb-0",
                {
                  "bg-green-500": item.status === "ami",
                  "bg-gray-500": item.status === "random" || !item.status,
                  "bg-red-700": item.status === "bloqué",
                  "bg-red-200": item.status === "blockedby",
                }
              )}
            >
              <h1 className="font-inter font-semibold text-subtitle text-white text-[18px]">
                {item.status === "ami"
                  ? t("friend.relation.friend")
                  : item.status === "bloqué"
                  ? t("friend.relation.blocked")
                  : item.status === "blockedby"
                  ? t("friend.relation.blockedBy")
                  : t("friend.relation.random")}
              </h1>
            </span>
			<span
                className={clsx(
                  "w-3 h-3 rounded-full border-2 border-white",
                  item.status === "ami"
                    ? friendOnlineStatus[item.id] === true
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-grey-500"
                )}
                title={friendOnlineStatus[item.id] === true ? t("friend.status.online") : t("friend.status.offline")}
            />
            <h2 className="font-inter font-semibold text-subtitle text-white text-[17px] truncate max-w-[130px] sm:max-w-[180px]">
              {item.name}
            </h2>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
            {activeTab === "notFriend" && (
              <>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition text-sm sm:text-base"
                  onClick={() => onAddFriend(item.id)}
                  disabled={isBlocked(item.id)}
                  title={isBlocked(item.id) ? t("friend.buttonError.blockedTwoWay") : undefined}
                >
                  {t("friend.actions.sendRequest")}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition text-sm sm:text-base"
                  onClick={() => onBlock(item.id)}
                  disabled={blockedByIds.has(item.id)}
                  title={blockedByIds.has(item.id) ? t("friend.buttonError.blockedBy") : undefined}
                >
                  {t("friend.actions.block")}
                </button>
              </>
            )}
            {activeTab === "friends" && (
              <>
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded transition text-sm sm:text-base"
                  onClick={() => onRemoveFriend(item.id)}
                  disabled={isBlocked(item.id)}
                  title={isBlocked(item.id) ? t("friend.buttonError.blockedTwoWay") : undefined}
                >
                  {t("friend.actions.remove")}
                </button>
                <button
                  className={clsx(
                    "px-2 py-1 rounded transition text-white text-sm sm:text-base",
                    "bg-red-500 hover:bg-red-600"
                  )}
                  onClick={() => onBlock(item.id)}
                  disabled={blockedByIds.has(item.id)}
                  title={blockedByIds.has(item.id) ? t("friend.buttonError.blockedBy") : undefined}
                >
                  {t("friend.actions.block")}
                </button>
              </>
            )}
            {activeTab === "requests" && (
              <>
                {item.requestType === "received" && (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition text-sm sm:text-base"
                      onClick={() => onAcceptRequest(item.id)}
                      disabled={isBlocked(item.id)}
                      title={isBlocked(item.id) ? t("friend.buttonError.blockedTwoWay") : undefined}
                    >
                      {t("friend.actions.accept")}
                    </button>
                  </>
                )}
                {item.requestType === "sent" && (
					<>
						<span className="text-gray-400 text-sm">{t("friend.status.sent")}</span>
						<button
							className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded transition text-sm sm:text-base"
							onClick={() => onCancelRequest(item.id)}
						>
							{t("friend.actions.cancelRequest")}
						</button>
					</>
			   )}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition text-sm sm:text-base"
                  onClick={() => onBlock(item.id)}
                  disabled={blockedByIds.has(item.id)}
                  title={blockedByIds.has(item.id) ? t("friend.buttonError.blockedBy") : undefined}
                >
                  {t("friend.actions.block")}
                </button>
              </>
            )}
            {activeTab === "blocked" && (
              <>
                {item.status === "bloqué" && (
                  <button
                    className={clsx(
                      "px-2 py-1 rounded transition text-white text-sm sm:text-base",
                      "bg-red-700 hover:bg-red-600"
                    )}
                    onClick={() => onUnblock(item.id)}
                  >
                    {t("friend.actions.unblock")}
                  </button>
                )}
                {item.status === "blockedby" && (
                  <span className="text-gray-400 text-sm">{t("friend.errors.cannotUnblock")}</span>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendScrollableList;