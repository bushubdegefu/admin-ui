import { UserDetailsPage } from "./coid";

export default function SingleUser({ params }) {
  return (
    <>
      <UserDetailsPage id={params.id} />
    </>
  );
}
