import { NextFunction, Response, Request } from 'express';
import prisma from './prisma';

const getOrders = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: true
            }
        });

        return res.status(200).json({
            code: 200,
            message: "Orders Fetched",
            data: orders
        })
    } catch (error) {
        next(error)
    }
}

export default getOrders;