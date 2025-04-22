import os
from fabric import Connection

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password"
ADMIN_EMAILADR = "admin@example.com"

def setup_env():
    # This task is now handled by setup-lrs.sh
    pass

def setup_lrs():
    c = Connection('localhost')
    # Ensure we're in the correct directory
    c.local("cd /opt/lrs/ADL_LRS")

    # Activate the virtual environment and run commands
    venv_cmd = ". /opt/lrs/env/bin/activate && "
    # Create log directories
    log_dir = '/opt/lrs/logs'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    celery_log_dir = os.path.join(log_dir, 'celery')
    if not os.path.exists(celery_log_dir):
        os.makedirs(celery_log_dir)

    supervisord_log_dir = os.path.join(log_dir, 'supervisord')
    if not os.path.exists(supervisord_log_dir):
        os.makedirs(supervisord_log_dir)

    uwsgi_log_dir = os.path.join(log_dir, 'uwsgi')
    if not os.path.exists(uwsgi_log_dir):
        os.makedirs(uwsgi_log_dir)

    nginx_log_dir = os.path.join(log_dir, 'nginx')
    if not os.path.exists(nginx_log_dir):
        os.makedirs(nginx_log_dir)

    # Create media directories
    media_dir = '/opt/lrs/ADL_LRS/static'
    agent_profile = os.path.join(media_dir, 'agent_profile')
    activity_profile = os.path.join(media_dir, 'activity_profile')
    activity_state = os.path.join(media_dir, 'activity_state')
    statement_attachments = os.path.join(media_dir, 'attachment_payloads')

    if not os.path.exists(media_dir):
        os.makedirs(media_dir)

    if not os.path.exists(agent_profile):
        os.makedirs(agent_profile)

    if not os.path.exists(activity_profile):
        os.makedirs(activity_profile)

    if not os.path.exists(activity_state):
        os.makedirs(activity_state)

    if not os.path.exists(statement_attachments):
        os.makedirs(statement_attachments)

    # Run Django commands within the virtual environment
    c.local(f"{venv_cmd} ./manage.py createcachetable")
    c.local(f"{venv_cmd} ./manage.py migrate")
    c.local(f"{venv_cmd} ./manage.py makemigrations adl_lrs lrs oauth_provider")
    c.local(f"{venv_cmd} ./manage.py migrate")

def create_admin():
    c = Connection('localhost')
    c.local("cd /opt/lrs/ADL_LRS")
    venv_cmd = ". /opt/lrs/env/bin/activate && "
    # Create a superuser using Django's shell
    command = (
        f"{venv_cmd} python3 manage.py shell -c "
        f"\"from django.contrib.auth import get_user_model; "
        f"User = get_user_model(); "
        f"User.objects.create_superuser('{ADMIN_USERNAME}', '{ADMIN_EMAILADR}', '{ADMIN_PASSWORD}')\""
    )
    c.local(command)

def test_lrs():
    c = Connection('localhost')
    c.local("cd /opt/lrs/ADL_LRS")
    venv_cmd = ". /opt/lrs/env/bin/activate && "
    c.local(f"{venv_cmd} ./manage.py test lrs.tests")
