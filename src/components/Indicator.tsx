import { Loader2 } from "lucide-react";

export default function Indicator(props: { text: any }) {
  return (
    <div className="w-full flex flex-col items-center justify-center my-4">
      <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      <p className="text-blue-500 mt-4 text-lg text-balance">{props.text}</p>
    </div>
  );
}
