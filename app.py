from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

# Ruta del archivo JSON
DATA_FILE = 'adquisiciones.json'

# Verificar si el archivo JSON existe, si no, crearlo vacío
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

# Leer adquisiciones del archivo JSON
def leer_adquisiciones():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

# Guardar adquisiciones en el archivo JSON
def guardar_adquisiciones(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Obtener todas las adquisiciones
@app.route('/adquisiciones', methods=['GET'])
def obtener_adquisiciones():
    adquisiciones = leer_adquisiciones()
    return jsonify(adquisiciones)

# Registrar una nueva adquisición
@app.route('/adquisiciones', methods=['POST'])
def registrar_adquisicion():
    nueva_adquisicion = request.json

    # Validación de datos ingresados
    required_fields = ['presupuesto', 'unidad', 'tipo', 'cantidad', 
                       'valorUnitario', 'fecha', 'proveedor', 'documentacion']
    for field in required_fields:
        if field not in nueva_adquisicion:
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400

    # Cálculo del valor total
    nueva_adquisicion['valorTotal'] = nueva_adquisicion['cantidad'] * nueva_adquisicion['valorUnitario']

    adquisiciones = leer_adquisiciones()
    adquisiciones.append(nueva_adquisicion)
    guardar_adquisiciones(adquisiciones)

    return jsonify(nueva_adquisicion), 201

# Obtener el historial de cambios (ejemplo básico)
@app.route('/adquisiciones/historial', methods=['GET'])
def obtener_historial():
    # Este es solo un ejemplo, deberías implementar el registro del historial adecuadamente
    historial = [
        {
            "id_adquisicion": 1,
            "fecha_cambio": "2024-10-18",
            "campo_modificado": "valorUnitario",
            "valor_anterior": 1000000,
            "nuevo_valor": 1200000
        }
    ]
    return jsonify(historial)

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
