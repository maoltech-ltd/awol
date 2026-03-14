import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Pagination({ page, hasNext }: { page: number; hasNext: boolean }) {
  const router = useRouter();
  const params = useSearchParams();

  const setPage = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set('page', String(p));
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button className="px-3 py-1 border" onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
      <span className="px-2">Page {page}</span>
      <button disabled={!hasNext} className="px-3 py-1 border disabled:opacity-40" onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}