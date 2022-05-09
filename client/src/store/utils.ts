interface LinkedList<T> {
  next: string | null;
}

export function sortLinkedList<T extends LinkedList<T> & { _id: string }>(
  arr: Array<T>
): T[] {
  const map = new Map(arr.map((el) => [String(el.next), el]));
  const ordered: T[] = [];

  let current: T = map.get("null")!;
  for (let i = 0; i < (arr.length-1); i++) {
    ordered.push(current);
    current = map.get(current._id)!;
  }
  ordered.push(current);

  return ordered.reverse();
}
