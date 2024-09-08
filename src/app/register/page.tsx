import { Spacer, Profile } from "@/components";
export default async function RegisterPage() {
  return (
    <>
      <Spacer space={20} />
      <h2 className="text-center">Welcome Aboard</h2>
      <Spacer space={20} />
      <Profile />
    </>
  );
}
