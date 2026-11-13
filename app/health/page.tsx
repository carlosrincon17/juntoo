import type { Metadata } from "next";
import { getHealthBoard } from "./actions/health";
import { HealthBoard } from "./components/health-board";

export const metadata: Metadata = {
    title: "Cuaderno",
    description: "Episodios, temperatura y medicamentos para llevar a la doctora.",
};

function numberOrNull(value: string | undefined): number | null {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function HealthPage({
    searchParams,
}: {
    searchParams: Promise<{ start?: string; episode?: string }>;
}) {
    const params = await searchParams;
    const children = await getHealthBoard();
    return (
        <HealthBoard
            initialChildren={children}
            startChildId={numberOrNull(params.start)}
            episodeId={numberOrNull(params.episode)}
        />
    );
}
