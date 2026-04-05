from django.db import migrations

def seed_community_data(apps, schema_editor):
    User = apps.get_model('users', 'User')
    Post = apps.get_model('community', 'Post')
    Destination = apps.get_model('destinations', 'Destination')

    # Get the admin user we created or any user
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        # Fallback to any user if admin not found (e.g. initial dev)
        admin_user = User.objects.first()
    
    if not admin_user:
        return

    # Get destinations for linking
    paris = Destination.objects.filter(slug='paris-france').first()
    goa = Destination.objects.filter(slug='goa-india').first()
    manali = Destination.objects.filter(slug='manali-india').first()

    # Create posts
    Post.objects.create(
        author=admin_user,
        title='My Magical Sunset in Goa',
        body='Just returned from Goa and the sunsets were absolutely breathtaking. If you are going, make sure to visit Vagator beach for the best views! The vibes are amazing and the seafood is must-try.',
        category='stories',
        destination=goa
    )

    Post.objects.create(
        author=admin_user,
        title='Best Photo spots in Paris',
        body='Paris is a photographers dream! Beyond the Eiffel tower, check out the streets of Montmartre and the bridges at sunrise. Every corner tells a story of art and history.',
        category='photos',
        destination=paris
    )

    Post.objects.create(
        author=admin_user,
        title='What to pack for Manali trekking',
        body='Hiking in Manali can be unpredictable. Always carry layers, good quality waterproof boots, and a power bank. Don\'t forget to respect the local culture and keep the trails clean!',
        category='tips',
        destination=manali
    )

class Migration(migrations.Migration):
    dependencies = [
        ('community', '0002_post_category'),  # Changed from 0001 to 0002 to avoid conflict
        ('destinations', '0003_seed_data'),
        ('users', '0003_create_superuser_final_fix'),
    ]

    operations = [
        migrations.RunPython(seed_community_data),
    ]
