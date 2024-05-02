import prisma from "./prisma";

const getOrdersById = async(req, res, next)=>{
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: {
                id
            },
            include: {orderItems: true}
        });

        if(!order){
            return res.status(404).json({
                code: 404,
                message: "Order not found"
            })
        }

        return res.status(200).json({
            code: 200,
            message: "Order Info",
            data: order
        })
    } catch (error) {
        next(error)
    }
}

export default getOrdersById;