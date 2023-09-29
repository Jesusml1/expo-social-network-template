import { formatDistanceToNow } from "date-fns";

export function formatDate(timeStamp: string) {
  return formatDistanceToNow(new Date(timeStamp), { addSuffix: true });
}

export function truncateString(string: string) {
  if (string.length > 100) {
    return string.substring(0, 100) + "...";
  } else {
    return string;
  }
}
