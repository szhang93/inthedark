from django.db import migrations

def create_data(apps, schema_editor):
    Session = apps.get_model('sessions', 'Session')
    Student(name="BrownBear", userIPs="000.000.0000").save()

class Migration(migrations.Migration):

    dependencies = [
        ('sessions', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
