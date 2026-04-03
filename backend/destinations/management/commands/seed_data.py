import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from destinations.models import Destination, Hotel
from reviews.models import Review
from community.models import Post

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed database with realistic travel data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Admin User
        admin_email = 'admin@travel.com'
        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                email=admin_email,
                username='admin',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_email}'))

        # 2. Destinations
        destinations_data = [
            {'name': 'Goa', 'city': 'Panaji', 'country': 'India', 'category': 'beach', 'description': 'Beautiful beaches and nightlife.', 'image': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Manali', 'city': 'Manali', 'country': 'India', 'category': 'mountain', 'description': 'Snow-capped peaks and adventure.', 'image': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Jaipur', 'city': 'Jaipur', 'country': 'India', 'category': 'cultural', 'description': 'The Pink City with rich heritage.', 'image': 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Kerala', 'city': 'Munnar', 'country': 'India', 'category': 'mountain', 'description': 'God\'s own country with lush tea gardens.', 'image': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Ladakh', 'city': 'Leh', 'country': 'India', 'category': 'adventure', 'description': 'High-altitude desert and stunning lakes.', 'image': 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Shimla', 'city': 'Shimla', 'country': 'India', 'category': 'mountain', 'description': 'Queen of Hills with colonial charm.', 'image': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Udaipur', 'city': 'Udaipur', 'country': 'India', 'category': 'cultural', 'description': 'City of Lakes and royal palaces.', 'image': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Pondicherry', 'city': 'Pondicherry', 'country': 'India', 'category': 'beach', 'description': 'French colonial vibes and serene beaches.', 'image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Coorg', 'city': 'Madikeri', 'country': 'India', 'category': 'mountain', 'description': 'Scotland of India with coffee plantations.', 'image': 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80'},
            {'name': 'Andaman', 'city': 'Port Blair', 'country': 'India', 'category': 'beach', 'description': 'Crystal clear waters and coral reefs.', 'image': 'https://images.unsplash.com/photo-1589135410994-58a6a9d3c08b?auto=format&fit=crop&w=800&q=80'},
        ]

        for d_data in destinations_data:
            dest, created = Destination.objects.get_or_create(
                name=d_data['name'],
                defaults={
                    'city': d_data['city'],
                    'country': d_data['country'],
                    'category': d_data['category'],
                    'description': d_data['description'],
                    'featured_image': d_data['image'],
                    'is_featured': random.choice([True, False])
                }
            )
            if created:
                self.stdout.write(f'Created destination: {dest.name}')
            else:
                # Update image if it exists
                dest.featured_image = d_data['image']
                dest.save()

            # 3. Hotels for each destination
            hotel_names = ['Grand Palace', 'Serene Resort', 'Ocean View', 'Mountain Lodge', 'Royal Heritage']
            for i in range(random.randint(2, 3)):
                Hotel.objects.get_or_create(
                    destination=dest,
                    name=f"{dest.name} {random.choice(hotel_names)}",
                    defaults={
                        'description': f'A luxury stay in the heart of {dest.name}.',
                        'address': f'{random.randint(1, 100)} Main St, {dest.city}',
                        'price_per_night': random.randint(2000, 15000),
                        'star_rating': random.randint(3, 5),
                        'amenities': ['WiFi', 'Pool', 'AC', 'Breakfast']
                    }
                )

        # 4. Community Posts
        self.stdout.write('Seeding community posts...')
        admin_user = User.objects.get(email=admin_email)
        
        posts_data = [
            # Photos
            {
                'title': 'Sunset at Palolem Beach',
                'body': 'Caught this amazing sunset yesterday in South Goa. The colors were just magical!',
                'category': 'photos',
                'image': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
                'dest_name': 'Goa'
            },
            {
                'title': 'The Hawa Mahal in Pink',
                'body': 'Early morning views of the Wind Palace. Jaipur truly lives up to its name.',
                'category': 'photos',
                'image': 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80',
                'dest_name': 'Jaipur'
            },
            # Stories
            {
                'title': 'My Solo Trip to the Mountains',
                'body': 'I spent a week in Manali completely disconnected from the world. Hiking through the pine forests and listening to the Beas river was exactly what I needed. If you are looking for peace, head to Old Manali.',
                'category': 'stories',
                'image': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
                'dest_name': 'Manali'
            },
            {
                'title': 'Lost in the French Quarter',
                'body': 'Walking through the streets of Pondicherry felt like being in a different era. The mustard-colored buildings and bougainvillea-lined streets are a photographer\'s dream.',
                'category': 'stories',
                'image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
                'dest_name': 'Pondicherry'
            },
            # Tips
            {
                'title': 'Best time to visit Leh',
                'body': 'Pro tip: Visit between June and September. The roads are clear and the weather is perfect for sightseeing. Don\'t forget to carry sunscreen and stay hydrated!',
                'category': 'tips',
                'dest_name': 'Ladakh'
            },
            {
                'title': 'How to save on houseboats in Kerala',
                'body': 'Book directly with the boat owners in Alleppey instead of through agents. You can often negotiate 20-30% lower prices, especially if you book on the spot.',
                'category': 'tips',
                'dest_name': 'Kerala'
            },
            # Reviews
            {
                'title': 'Amazing stay at Coorg Coffee Plantation',
                'body': 'The experience of staying right in the middle of a coffee estate was unparalleled. The aroma of fresh coffee in the morning is something I will never forget.',
                'category': 'reviews',
                'dest_name': 'Coorg'
            },
            {
                'title': 'Shimla Toy Train is a must!',
                'body': 'The Kalka-Shimla toy train journey is slow but the views are breathtaking. It\'s a UNESCO world heritage site for a reason. Definitely worth the 5-hour ride.',
                'category': 'reviews',
                'dest_name': 'Shimla'
            }
        ]

        for p_data in posts_data:
            dest = Destination.objects.filter(name=p_data['dest_name']).first()
            Post.objects.get_or_create(
                title=p_data['title'],
                defaults={
                    'author': admin_user,
                    'body': p_data['body'],
                    'category': p_data['category'],
                    'image': p_data.get('image'),
                    'destination': dest
                }
            )

        self.stdout.write(self.style.SUCCESS('Data seeding completed!'))
