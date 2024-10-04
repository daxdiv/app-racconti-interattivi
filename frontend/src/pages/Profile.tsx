import { ModeToggle } from "@/components/ModeToggle";

function Profile() {
  return (
    <>
      <div className="flex justify-center items-center gap-x-1 absolute top-2 left-2">
        <ModeToggle />
      </div>

      <div className="flex justify-center items-center min-h-screen">Profilo</div>
    </>
  );
}

export default Profile;
