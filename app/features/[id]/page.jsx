import { FeatureDetailsPage } from "./coid";

export default function SingleFeature({ params }) {
  return (
    <>
      <FeatureDetailsPage id={params.id} />
    </>
  );
}
