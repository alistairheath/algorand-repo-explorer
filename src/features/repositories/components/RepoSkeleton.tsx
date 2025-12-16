export default function RepoSkeleton() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body gap-3">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-16 w-full" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-5 w-24" />
        </div>
      </div>
    </div>
  );
}
