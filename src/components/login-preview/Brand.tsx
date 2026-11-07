export default function Brand() {
  return (
    <div className="flex items-center gap-[11px] text-[15px] font-bold tracking-[-0.3px]">
      <span
        aria-hidden="true"
        className="grid size-9 grid-cols-2 grid-rows-2 gap-[3px] rounded-[11px] bg-[linear-gradient(140deg,#7770ff,#4b43da)] p-2 shadow-[0_7px_22px_#5148df45]"
      >
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white opacity-[0.67]" />
        <span className="rounded-[2px] bg-white opacity-[0.67]" />
        <span className="rounded-[2px] bg-white opacity-[0.38]" />
      </span>
      <span>Product Manager</span>
    </div>
  );
}
