FROM dsavell/grav:admin
COPY ./site.conf /etc/nginx/sites-available/default

# TODO: this will sort of work for now, but AFAIU the data only be copied to the volume once,
# when it is first created. to copy it everytime there's two options:
# - add an init script that always copies this template to the volume
#   - but then we need to be careful not to overwrite the page & account data
# - mount the volume to /var/www/grav/user/pages
#   - but then we need to persist accounts etc separately, probably in another volume
#     ...though i guess that makes sense?
COPY --chown=xyz:xyz ./user /var/www/grav/user 
