import { formatDistanceToNow } from "date-fns";

export function formatDate(timeStamp: string) {
  return formatDistanceToNow(new Date(timeStamp), { addSuffix: true });
}
