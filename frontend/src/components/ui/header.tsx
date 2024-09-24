import CreateNode from "@/components/CreateNode";

function Header() {
  return (
    <header className="w-full h-[10vh] border-border/40 bg-black flex justify-between px-3 items-center">
      <div>
        <h1 className="scroll-m-20 font-bold tracking-tight text-4xl text-white">
          Titolo
        </h1>
      </div>
      <div className="flex justify-center items-center gap-x-2">
        <CreateNode />
      </div>
    </header>
  );
}

export default Header;
