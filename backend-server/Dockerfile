FROM dsavell/grav:admin
COPY ./site.conf /etc/nginx/sites-available/default

ENV TEMPLATE_DIR=/template/user
COPY --chown=xyz:xyz ./user "${TEMPLATE_DIR}"
COPY --chown=xyz:xyz ./update-files.sh /
RUN chmod +x /update-files.sh

CMD ["sh", "-c", "/update-files.sh \"$TEMPLATE_DIR\" /var/www/grav/user && exec /init-admin"]