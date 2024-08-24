server {
    server_name bysite.pro www.bysite.pro;

    root /var/www/bysite.pro;
    index index.html index.htm index.php;

    location / {
        proxy_pass http://191.96.251.44:8020;  # Asumiendo que tu app corre en el puerto 3000
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock; # Ajusta la versión de PHP según corresponda
    }

    location ~ /\.ht {
        deny all;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/bysite.pro/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/bysite.pro/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}

server {
    if ($host = www.bysite.pro) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = bysite.pro) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name bysite.pro www.bysite.pro;
    return 404; # managed by Certbot




}
