from django.db import models

class Session(models.Model):
    name = models.CharField("Name", max_length=100)
    userIPs = models.CharField("User IPs", max_length=60)

    def __str__(self):
        return self.name
