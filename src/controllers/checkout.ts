import { NextFunction, Request, Response } from "express";
import { CreateOrderDTOSchema } from '../../schemas';
import axios from "axios";
import { CART_URL, FISH_URL } from "@/config";
import { z } from "zod";
import { CartItemDTOSchema } from "./schemas";
import prisma from "./prisma";


const checkout = async (req:Request, res:Response, next:NextFunction) => {
    try{
        //validate
        const parseBody = CreateOrderDTOSchema.safeParse(req.body);
        if(!parseBody.success){
            return res.status(400).json({
                code: 400,
                message: parseBody.error.errors[0].message
            })
        }

        // get cart details
        const {data: cartData} = await axios.get(`${CART_URL}/carts/me`, {
            headers: {
                'x-cart-session-id': parseBody.data.cartSessionId
            }
        });

        const cartItems = z.array(CartItemDTOSchema).safeParse(cartData.data);

        if(!cartItems.success){
            return res.status(400).json({
                code: 400,
                message: cartItems.error.errors[0].message
            });
        }

        if(cartItems.data.length === 0){
            return res.status(400).json({
                code: 400,
                message: 'Cart is empty'
            })
        }


        // Get Product details from cart items
        const productDetails = await Promise.all(cartItems.data.map(async (item) => {
            const {data: fish} = await axios.get(`${FISH_URL}/fishes/${item.productId}`);
            return {
                productId: fish.data.id as string,
                productName: fish.data.name as string,
                sku: fish.data.sku as string,
                price: fish.data.price as number,
                quantity: item.quantity,
                total: fish.data.price * item.quantity
            }
        }))

       

        // amount to be paid
        const subtotal = productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // 5% tax
        const tax = subtotal * 0.05;
        const gradTotal = subtotal + tax;

        // create order
        const order = await prisma.order.create({
            data: {
                userId: parseBody.data.userId,
                userName: parseBody.data.userName,
                userEmail: parseBody.data.userEmail,
                tax: tax,
                subtotal: subtotal,
                grandTotal: gradTotal,
                orderItems: {
                    create: productDetails.map(items=>({
                        ...items
                    }))
                }
            }
        });
        

        // clear cart service
        await axios.get(`${CART_URL}/carts/clear`, {
            headers: {
                'x-cart-session-id': parseBody.data.cartSessionId
            }
        });

        return res.status(201).json({
            code: 201,
            message: `Order Placed ${order.id}`,
        })
    }catch(err){
        next(err)
    }
}

export default checkout;