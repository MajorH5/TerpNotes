from flask import Flask, send_from_directory, redirect, request
import ssl
import threading
import os

app = Flask(__name__, static_folder='public')

# Serve index.html on root
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Serve other static files, handle extension-less routes
@app.route('/<path:path>')
def static_files(path):
    file_path = os.path.join(app.static_folder, path)

    # If it's a file that exists, serve it
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)

    # If it's a directory with index.html
    if os.path.isdir(file_path) and os.path.isfile(os.path.join(file_path, 'index.html')):
        return send_from_directory(file_path, 'index.html')

    # Try adding .html
    if os.path.isfile(file_path + '.html'):
        return send_from_directory(app.static_folder, path + '.html')

    # Otherwise serve custom 404 page if it exists
    if os.path.isfile(os.path.join(app.static_folder, '404.html')):
        return send_from_directory(app.static_folder, '404.html'), 404

    # Fallback if 404.html isn't found
    return "404 Not Found", 404

# HTTP to HTTPS redirect
http_redirect = Flask('redirect')

@http_redirect.route('/', defaults={'path': ''})
@http_redirect.route('/<path:path>')
def redirect_to_https(path):
    return redirect(f'https://{request.host}{request.full_path}', code=301)

def run_https():
    context = ('/etc/ssl/web/terpnotes_tech.crt', '/etc/ssl/web/terpnotes_tech_private.key')
    app.run(host='0.0.0.0', port=443, ssl_context=context)

def run_http():
    http_redirect.run(host='0.0.0.0', port=80)

if __name__ == '__main__':
    threading.Thread(target=run_https).start()
    threading.Thread(target=run_http).start()
