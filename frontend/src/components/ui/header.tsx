import { ModeToggle } from "@/components/ModeToggle";

function Header() {
  return (
    <header className="w-full h-[10vh] border-border/40 bg-black flex justify-between px-3 items-center">
      <div>
        <h1 className="scroll-m-20 font-bold tracking-tight text-4xl text-white">
          Titolo
        </h1>
      </div>

      <ModeToggle />
    </header>
  );
}

export default Header;
