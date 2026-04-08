'use client'

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, useDisclosure, Divider, Skeleton } from "@heroui/react";
import { FaIdCard, FaTrash, FaPlus, FaRegCopy, FaHashtag } from "react-icons/fa";
import { getImportantIds, deleteImportantId } from "./actions/ids";
import ImportantIdDrawer from "./components/important-id-drawer";

type ImportantId = {
    id: number;
    name: string;
    value: string;
    description: string | null;
    createdAt: Date;
}

export default function ImportantIdsPage() {
    const [ids, setIds] = useState<ImportantId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const fetchIds = async () => {
        setIsLoading(true);
        try {
            const data = await getImportantIds();
            setIds(data as ImportantId[]);
        } catch (error) {
            console.error("Error fetching IDs", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIds();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteImportantId(id);
            await fetchIds();
        } catch (error) {
            console.error("Error deleting ID", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <FaIdCard className="text-indigo-600" /> Bóveda Familiar
                    </h1>
                    <p className="text-gray-500 font-light text-sm max-w-2xl">
                        Guarda y accede rápidamente a información esencial para tu familia. Códigos CENS, registros de propiedades, documentos, etc.
                    </p>
                </div>
                <Button color="primary" onPress={onOpen} startContent={<FaPlus />} className="shadow-md shadow-indigo-200">
                    Nuevo Registro
                </Button>
            </div>

            <Divider className="bg-gray-100" />

            {/* Content Array */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="w-full">
                            <CardBody className="p-6 space-y-4">
                                <Skeleton className="w-2/3 h-6 rounded-lg" />
                                <Skeleton className="w-1/2 h-4 rounded-lg" />
                                <Skeleton className="w-full h-10 rounded-lg mt-4" />
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : ids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-indigo-500 text-2xl">
                        <FaHashtag />
                    </div>
                    <h3 className="text-gray-900 font-medium text-lg">No hay registros</h3>
                    <p className="text-gray-400 text-sm mt-1 mb-6 max-w-sm">Comienza agregando los números de documento o códigos de servicios que necesites tener siempre a la mano.</p>
                    <Button color="primary" variant="flat" onPress={onOpen}>Crear tu primer ID</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ids.map(item => (
                        <Card key={item.id} className="group border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex pb-2 px-6 pt-6 justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                    {item.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
                                </div>
                                <Button isIconOnly size="sm" variant="light" color="danger" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 -mr-2 -mt-2" onPress={() => handleDelete(item.id)}>
                                    <FaTrash size={12} />
                                </Button>
                            </CardHeader>
                            <CardBody className="px-6 pb-6 pt-2">
                                <div className="mt-2 bg-indigo-50/50 rounded-xl p-3 flex items-center justify-between group/value relative border border-indigo-100/50">
                                    <span className="font-mono text-indigo-900 font-medium tracking-wide truncate pr-8">{item.value}</span>
                                    <Button 
                                        isIconOnly 
                                        size="sm" 
                                        variant="light" 
                                        className="text-indigo-400 hover:text-indigo-600 absolute right-1" 
                                        onPress={() => copyToClipboard(item.value)}
                                        title="Copiar valor"
                                    >
                                        <FaRegCopy size={14} />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            <ImportantIdDrawer isOpen={isOpen} onOpenChange={onOpenChange} onSave={fetchIds} />
        </div>
    );
}
