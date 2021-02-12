import os
from optparse import make_option
from django.conf import settings
from django.core.cache import cache
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from django.apps import apps

def get_app(app_name):
    return apps.get_app_config(app_name)

class Command(BaseCommand):
    help = 'Clears all data in the apps (does not clear users), clears cache and deletes any media files'
    option_list = BaseCommand.option_list + (
        make_option(
            '--sa',
            dest='saveagents',
            default=False,
            help='Save the agents associated with the users\' emails',
            metavar='SA'
        ),
    )

    def handle(self, *args, **options):
        # To preserve users' agents add -sa True when running command
        sa = False
        if options['saveagents']:
            sa = True

        apps = []
        apps.append(get_app('lrs'))
        apps.append(get_app('oauth_provider'))
        apps.append(get_app('adl_lrs'))

        # Clear app(db) data
        for app in apps:
            for model in app.get_models():
                if app.name.split('.')[0] == 'lrs' and model.__name__ == "Agent" and sa:
                    user_emails = [
                        "mailto:" + s for s in User.objects.all().values_list('email', flat=True)]
                    model.objects.exclude(mbox__in=user_emails).delete()
                    self.stdout.write("Deleted all %s objects from - %s except for the Agents associated with LRS users\n" % (
                        model.__name__, app.name.split('.')[0]))
                else:
                    
                    # Chunking configuration
                    step = 20000
                    total = model.objects.count()
                    steps = total // step
                    
                    # Clear in chunks
                    for i in xrange(steps):
                        chunk = model.objects.filter(**{filter: "%s__id__lte=%s" % (model.__name__, i*steps)})
                        chunk.delete()
                    
                    # Clear residuals
                    model.objects.all().delete()
                    self.stdout.write("Deleted all %s objects from - %s\n" %
                                      (model.__name__, app.name.split('.')[0]))

        # Clear cache data
        cache.clear()

        # Clear media folders
        for subdir, dirs, files in os.walk(settings.MEDIA_ROOT):
            for dr in dirs:
                for sd, ds, fs in os.walk(os.path.join(settings.MEDIA_ROOT, dr)):
                    for f in fs:
                        os.remove(os.path.join(sd, f))

        self.stdout.write("Successfully cleared all data from the apps\n")
