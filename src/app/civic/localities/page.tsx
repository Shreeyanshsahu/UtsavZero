
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";


import CivicLayout from "@/components/civic/layout/CivicLayout";
import type { WardBoundaryProperties } from "@/services/geodata/localityBoundaryService";

const CivicWardMap = dynamic(
  () => import("@/components/civic/map/CivicWardMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[650px] w-full animate-pulse rounded-2xl bg-gray-200" />
    ),
  }
);

export default function LocalityExplorerPage() {
  const router = useRouter();
  const [selectedWard, setSelectedWard] =
    useState<WardBoundaryProperties | null>(null);

  return (
    <CivicLayout
      title="Locality Explorer"
      description="Explore Delhi's ward boundaries and inspect localities for civic planning."
    >
      <div className="space-y-5">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total wards</p>
            <h2 className="mt-2 text-2xl font-bold">290</h2>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Selected locality</p>
            <h2 className="mt-2 text-lg font-bold">
              {selectedWard?.localityName ?? "None"}
            </h2>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Data coverage</p>
            <h2 className="mt-2 text-2xl font-bold">Delhi</h2>
          </div>
        </div>

        <div className="h-[650px] overflow-hidden rounded-2xl border">
          <CivicWardMap
            selectedWardId={selectedWard?.localityId ?? null}
            onWardSelect={(ward) => {
              setSelectedWard(
                ward.localityId ? ward : null
              );
            }}
          />
        </div>

        {selectedWard && (
          <div className="rounded-xl border p-5">
            <h3 className="text-lg font-bold">
              {selectedWard.localityName}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Ward number: {String(selectedWard.Ward_No ?? "Not identified")}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Source ID: {selectedWard.sourceFeatureId}
            </p>
          </div>
        )}
        {selectedWard && (
          <button
            onClick={() =>
              router.push(
                `/civic/zones?localityId=${selectedWard.localityId}`
              )
            }
            className="rounded-xl bg-[#ff4b0b] px-5 py-3 text-white"
          >
            Plan Zone for This Ward
          </button>
        )}

      </div>
    </CivicLayout>
  );
}
