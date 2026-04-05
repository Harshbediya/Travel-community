from django.db import migrations
from django.utils.text import slugify

def add_more_destinations(apps, schema_editor):
    Destination = apps.get_model('destinations', 'Destination')
    Hotel = apps.get_model('destinations', 'Hotel')

    # Data for new destinations with correct field names
    new_destinations = [
        {
            'name': 'Bali, Indonesia',
            'country': 'Indonesia',
            'city': 'Bali',
            'description': 'A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
            'category': 'beach',
            'base_price': 45000,
            'avg_rating': 4.9,
            'is_featured': True
        },
        {
            'name': 'Switzerland',
            'country': 'Switzerland',
            'city': 'Bern',
            'description': 'Famous for its stunning Alpine scenery, luxury watches, and delicious chocolate. A dream destination for snow lovers.',
            'category': 'mountain',
            'base_price': 120000,
            'avg_rating': 4.8,
            'is_featured': True
        },
        {
            'name': 'Kedarnath',
            'country': 'India',
            'city': 'Kedarnath',
            'description': 'A holy town and a popular pilgrimage destination, home to the majestic Kedarnath Temple surrounded by snow-capped peaks.',
            'category': 'adventure',
            'base_price': 15000,
            'avg_rating': 4.9,
            'is_featured': True
        },
        {
            'name': 'Leh Ladakh',
            'country': 'India',
            'city': 'Leh',
            'description': 'The land of high passes! Experience the raw beauty of the Himalayas, turquoise lakes, and unique Tibetan culture.',
            'category': 'adventure',
            'base_price': 35000,
            'avg_rating': 4.7,
            'is_featured': True
        }
    ]

    for d_data in new_destinations:
        dest = Destination.objects.create(
            name=d_data['name'],
            slug=slugify(d_data['name']),
            country=d_data['country'],
            city=d_data['city'],
            description=d_data['description'],
            category=d_data['category'],
            base_price=d_data['base_price'],
            avg_rating=d_data['avg_rating'],
            is_featured=d_data['is_featured']
        )
        
        # Add a sample hotel for each with correct fields
        Hotel.objects.create(
            destination=dest,
            name=f"{d_data['name']} Luxury Resort",
            description=f"A premium stay experience in the heart of {d_data['name']}.",
            price_per_night=5000 if d_data['base_price'] < 50000 else 15000,
            star_rating=5
        )

class Migration(migrations.Migration):
    dependencies = [
        ('destinations', '0003_seed_data'),
    ]

    operations = [
        migrations.RunPython(add_more_destinations),
    ]
