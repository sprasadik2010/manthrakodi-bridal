# backend/app/routers/whatsapp.py
from fastapi import APIRouter, HTTPException
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse

router = APIRouter()

# Twilio WhatsApp credentials (you'll need to sign up for Twilio)
TWILIO_ACCOUNT_SID = "your_account_sid"
TWILIO_AUTH_TOKEN = "your_auth_token"
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"  # Twilio WhatsApp number

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(request: dict):
    """
    Webhook to receive WhatsApp messages from customers
    """
    try:
        # Parse incoming message
        incoming_msg = request.get('Body', '').lower()
        from_number = request.get('From', '')
        
        # Handle different message types
        if 'order' in incoming_msg or 'track' in incoming_msg:
            response = "To check your order status, please visit our website: https://manthrakodibridals.com/orders"
        elif 'price' in incoming_msg or 'cost' in incoming_msg:
            response = "You can view all our products with prices at: https://manthrakodibridals.com/products"
        elif 'contact' in incoming_msg or 'help' in incoming_msg:
            response = "📞 Call us: +91 98765 43210\n📍 Visit: 123 Bridal Street, Chennai\n🌐 Website: https://manthrakodibridals.com"
        else:
            response = "Thanks for contacting Manthrakodi Bridals! How can I help you today? You can:\n1. Place an order on our website\n2. Check order status\n3. View products\n4. Contact support"
        
        # Send automated response
        client.messages.create(
            body=response,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=from_number
        )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/whatsapp/send-order")
async def send_order_to_whatsapp(order_data: dict):
    """
    Send order confirmation to WhatsApp
    """
    try:
        customer_number = f"whatsapp:+91{order_data['customer']['phone']}"
        message = f"""
✅ Order Confirmed: #{order_data['order_id']}

Thank you for your order! We'll process it within 24 hours.

Order Total: ₹{order_data['total']}
Payment: {order_data['payment_method']}

You can track your order at:
https://manthrakodibridals.com/orders

Need help? Call +91 98765 43210
        """.strip()
        
        client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=customer_number
        )
        
        return {"status": "success", "message": "WhatsApp notification sent"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))