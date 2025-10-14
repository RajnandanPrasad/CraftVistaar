import React from "react";
import { useParams } from "react-router-dom";

export default function BuyPage() {
  const { id } = useParams();
  return <h2>Buying product #{id}</h2>;
}
