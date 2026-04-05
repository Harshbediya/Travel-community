from django.db import migrations
from django.utils.text import slugify

def add_more_destinations(apps, schema_editor):
    Destination = apps.get_model('destinations', 'Destination')
    Hotel = apps.get_model('destinations', 'Hotel')

    # Data for new destinations
    new_destinations = [
        {
            'name': 'Bali, Indonesia',
            'location': 'Indonesia',
            'description': 'A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
            'category': 'beach',
            'price': 45000,
            'rating': 4.9,
            'is_popular': True
        },
        {
            'name': 'Switzerland',
            'location': 'Europe',
            'description': 'Famous for its stunning Alpine scenery, luxury watches, and delicious chocolate. A dream destination for snow lovers.',
            'category': 'mountain',
            'price': 120000,
            'rating': 4.8,
            'is_popular': True
        },
        {
            'name': 'Kedarnath',
            'location': 'Uttarakhand, India',
            'description': 'A holy town and a popular pilgrimage destination, home to the majestic Kedarnath Temple surrounded by snow-capped peaks.',
            'category': 'adventure',
            'price': 15000,
            'rating': 4.9,
            'is_popular': True
        },
        {
            'name': 'Leh Ladakh',
            'location': 'Ladakh, India',
            'description': 'The land of high passes! Experience the raw beauty of the Himalayas, turquoise lakes, and unique Tibetan culture.',
            'category': 'adventure',
            'price': 35000,
            'rating': 4.7,
            'is_popular': True
        }
    ]

    for d_data in new_destinations:
        dest = Destination.objects.create(
            name=d_data['name'],
            slug=slugify(d_data['name']),
            location=d_data['location'],
            description=d_data['description'],
            category=d_data['category'],
            price=d_data['price'],
            rating=d_data['rating'],
            is_popular=d_data['is_popular']
        )
        
        # Add a sample hotel for each
        Hotel.objects.create(
            destination=dest,
            name=f"{d_data['name']} Luxury Resort",
            description=f"A premium stay experience in the heart of {d_data['name']}.",
            price_per_night=5000 if d_data['price'] < 50000 else 15000,
            rating=4.5
        )

class Migration(migrations.Migration):
    dependencies = [
        ('destinations', '0003_seed_data'),
    ]

    operations = [
        migrations.RunPython(add_more_destinations),
    ]
