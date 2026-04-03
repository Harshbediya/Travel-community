import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AdminDashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add(
            "admin_dashboard",
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "admin_dashboard",
            self.channel_name
        )

    async def receive(self, text_data):
        # Admin dashboard will only receive updates, not send messages
        pass

    async def send_login_event(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))