'use client'

import { generateFeedback} from "@/app/actions/ai";
import { CustomLoading } from "@/app/components/customLoading";
import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react"
import { FaMagic } from "react-icons/fa";

export default function Feedback(props: {
    patrimonies: number,
    savings: number,
    debts: number,
}) {

    const { patrimonies, savings, debts } = props;

    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<{
        healthy: string,
        familiar_financial_status: string,
        financial_liquidity: string,
    }>();

    const getCashlyFeedback = async () => { 
        const feedback = (await generateFeedback(savings, debts, patrimonies)).replace("json","");
        const feedbackJson = JSON.parse(feedback);
        setFeedback(feedbackJson);
        setLoading(false);
    }

    useEffect(() => {
        if (patrimonies && savings && debts) {
            getCashlyFeedback();
        }
    }, [patrimonies, savings, debts]);

    return (
        <Card className="flex justify-center items-center  bg-gradient-to-br from-white to-purple-100 p-4 mb-6">
            <CardBody>
                {loading ? 
                    <CustomLoading /> :
                    <div className="text-small">
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <FaMagic className="w-3 h-3 mr-2 flex-shrink-0 mt-1 text-gray-600" />
                                <p>{feedback?.healthy}</p>
                            </li>
                            <li className="flex items-start">
                                <FaMagic className="w-3 h-3 mr-2 flex-shrink-0 mt-1  text-gray-600" />
                                <p>{feedback?.familiar_financial_status}</p>
                            </li>
                            <li className="flex items-start">
                                <FaMagic className="w-3 h-3 mr-2 flex-shrink-0 mt-1  text-gray-600" />
                                <p>{feedback?.financial_liquidity}</p>
                            </li>
                        </ul>
                    </div>
                }
            </CardBody>
        </Card>
    )
}