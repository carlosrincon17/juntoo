import { Savings } from "@/app/types/saving";
import { Button,Checkbox,Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection } from "@nextui-org/react";
import toast from "react-hot-toast";
import { createSavings, updateSavings } from "../actions/savings";
import ToastCustom from "@/app/components/toastCustom";
import { useEffect, useState } from "react";
import { currencyToInteger, formatCurrency } from "@/app/lib/currency";

export default function SavingsManagerModal(props: {
    isOpen: boolean, 
    savings: Savings
    onOpenChange: (isOpen: boolean) => void,
    afterSaveSavings: () => void,
}) {
    const { isOpen, savings, onOpenChange, afterSaveSavings } = props;
    const [savingsValue, setSavingsValue] = useState('');
    const [selectedSavings, setSelectedSavings] = useState<Savings>()

    const onSaveSavings = async (onClose: () => void) => {
        const savingMethod = selectedSavings?.id ? updateSavings : createSavings;
        await savingMethod(selectedSavings as Savings);
        const message = selectedSavings?.id ? "Tus ahorros se actualizaron correctamente" : "Tus ahorros se agregaron correctamente";
        toast.custom((t) => <ToastCustom message={message} toast={t}/>);
        onClose();
        afterSaveSavings();
    }

    useEffect(() => {
        setSelectedSavings({...savings});
        setSavingsValue(formatCurrency(savings.value));
    }, [isOpen])
    
    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="center"
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-4 items-center">
                            <h2 className="text-2xl font-extralight"> {savings?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus={!Boolean(selectedSavings?.id)}
                                label="Nombre"
                                placeholder="Nombre"
                                size="lg"
                                labelPlacement="inside"
                                value={selectedSavings?.name}
                                onChange={(e) => {
                                    setSelectedSavings({...selectedSavings as Savings, name: e.target.value})
                                }}
                            />
                            <Input
                                autoFocus={Boolean(selectedSavings?.id)}
                                label="Valor"
                                placeholder="0"
                                size="lg"
                                labelPlacement="inside"
                                value={savingsValue}
                                onChange={(e) => {
                                    const intValue = currencyToInteger(e.target.value);
                                    setSavingsValue(formatCurrency(intValue));
                                    setSelectedSavings({...savings, value: intValue})
                                }}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">{savings.currency}</span>
                                    </div>
                                }
                            />
                            <Select
                                items={[{"label": "USD", "key": "USD"}, {"label": "COP", "key": "COP"}]}
                                label="Moneda"
                                selectedKeys={[selectedSavings?.currency as string]}
                                multiple={false}
                                isRequired
                                onSelectionChange={(e: SharedSelection) => {
                                    setSelectedSavings({...selectedSavings as Savings, currency: e.currentKey as string})
                                }}
                                placeholder="Seleccione una moneda"
                                size="lg"
                            >
                                {(currency) => <SelectItem key={currency.key}>{currency.label}</SelectItem>}
                            </Select>
                            <Checkbox size="lg" isSelected={selectedSavings?.isInvestment} onValueChange= {
                                (status: boolean) => setSelectedSavings({...selectedSavings as Savings, isInvestment: status})
                            }
                            >Es una inversión con interes anual</Checkbox>
                            {selectedSavings?.isInvestment && 
                                <Input
                                    label="Tasa de interés anual"
                                    placeholder="Tasa de interés anual"
                                    size="lg"
                                    type="number"
                                    labelPlacement="inside"
                                    max={100}
                                    defaultValue={selectedSavings?.annualInterestRate?.toString()}
                                    onChange={(e) => {
                                        const intValue = parseInt(e.target.value, 10);
                                        setSelectedSavings({...selectedSavings as Savings, annualInterestRate: intValue})
                                    }}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">%</span>
                                        </div>
                                    }
                                />
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                                    Cerrar
                            </Button>
                            <Button color="primary" onPress={() => onSaveSavings(onClose)}>
                                    Guardar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}