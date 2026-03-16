server {
    listen 443 ssl;
    server_name portalrcccuritiba.com.br www.portalrcccuritiba.com.br;

    ssl_certificate /etc/letsencrypt/live/portalrcccuritiba.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portalrcccuritiba.com.br/privkey.pem;

    return 301 https://www.rcccuritiba.com$request_uri;
}

server {
    listen 443 ssl;
    client_max_body_size 20M;
    server_name rcccuritiba.com.br www.rcccuritiba.com.br;

    ssl_certificate /etc/letsencrypt/live/portalrcccuritiba.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portalrcccuritiba.com.br/privkey.pem;

    root /var/www/html/portalrccctba;
    index index.html;

location /Api/ {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Access-Control-Allow-Origin $http_origin;
    proxy_set_header Access-Control-Allow-Credentials true;
    proxy_buffering off;
    proxy_read_timeout 60s;
    proxy_cache off;
    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate';
}

    location /assets/ {
        root /var/www/html/portalrccctba;
        try_files $uri $uri/ =404;
        add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate';
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate';
    }

    location = /phpmyadmin {
        return 301 /phpmyadmin/;
    }

    location /phpmyadmin/ {
        proxy_pass http://127.0.0.1:8080/phpmyadmin/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}