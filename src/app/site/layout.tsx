import Navigtion from "@/components/site/navigtion";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigtion />
      {children}
    </div>
  );
}
