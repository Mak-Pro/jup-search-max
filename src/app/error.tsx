"use client";
export default function RootError({ error }: { error: Error }) {
  return (
    <>
      <h1>Oops! {error.message}</h1>
    </>
  );
}
