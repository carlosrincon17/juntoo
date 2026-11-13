"use client";

import { addToast } from "@heroui/react";

const KNOWN = /^(La |Ya |Este |Escribe |No |El nombre|La dosis)/;

export function toastError(error: unknown) {
    const text = error instanceof Error ? error.message : "";
    addToast({
        title: "No se pudo guardar",
        description: KNOWN.test(text) ? text : "Inténtalo de nuevo",
    });
}

export function toastOk(title: string, description?: string) {
    addToast({ title, description });
}
