
import React from "react";

const AddRow = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full mt-2 flex items-center justify-between rounded-lg border border-dashed border-slate-500/40 px-4 py-3 hover:bg-[#25272F]"
    style={{ transition: 'background 0.2s' }}
  >
    <span className="text-sm text-slate-300">{label}</span>
    <span className="text-orange-400 text-xl">＋</span>
  </button>
);

export default AddRow;
