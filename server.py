from flask import Flask, request, session, Response
from flaskext.mysql import MySQL
from flask.ext.cors import CORS
import json

mysql = MySQL()
app = Flask(__name__)
cors = CORS(app)

app.config['MYSQL_DATABASE_USER'] = 'user'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pass'
app.config['MYSQL_DATABASE_DB'] = 'notes'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)

def log(msg):
	log_file = open('log.txt', 'a')
	log_file.write(msg + '\n')
	log_file.close()

@app.route('/logout', methods=['POST', 'OPTIONS'])

def logout():
	info = dict()
	session.clear()

	info = {"status":"Logged out"}
	return Response(json.dumps(info), mimetype="application/json")

@app.route('/', methods=['GET', 'OPTIONS'])
def hello():
	info = dict()
	info = {"status":"hello"}
	return Response(json.dumps(info), mimetype="application/json")

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
	params  = json.loads(json.dumps(request.json))
	
	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	owner_name=params['owner']
	stmt = "SELECT restaurant_id, owner FROM RESTAURANT where owner=%s"
	input=(owner_name);
	cursor.execute(stmt, input)
	data = cursor.fetchall()		
	if data is NONE:
 		info = {"status":"Log in failed."}
	else:
		info = {"status":"Logged in Successfully"}
		session['owner']=owner_name
		session['restaurant_id']=restaurant_id
	return Response(json.dumps(info), mimetype="application/json")
	
@app.route('/restaurant', methods=['POST', 'OPTIONS'])
def restaurant():
	params  = json.loads(json.dumps(request.json))
	
	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	if request.method == 'GET':
		stmt = "SELECT restaurant_id, restaurant_name, owner FROM RESTAURANT"
		cursor.execute(stmt)
		data = cursor.fetchall()		
		info = [{"restaurant_id" : item[0], "restaurant_name": item[1], "owner": item[2]} for item in data]

	elif request.method == 'POST':
		restaurant_name=params['restaurant_name']
		owner=params['owner']
		stmt = "INSERT INTO RESTAURANTS (restaurant_name, owner) VALUES (%s, %s)"
		data = (restaurant_name, owner)
		cursor.execute(stmt, data)
		id = cursor.lastrowid
		con.commit()
		info = {"restaurant_name" : restaurant_name, "owner": owner, "status":"success"}
		con.close()
	
	return Response(json.dumps(info),  mimetype='application/json')
	
@app.route('/review', methods=['POST', 'OPTIONS'])
def review():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	order_no = params['order_no']
	restaurant_id = params['restaurant_id']
	feedback = params['feedback']
	
	stmt = "UPDATE FEEDBACK SET feedback =%s where order_no=%s and restaurant_id=%s"
	data = (feedback, order_no, restaurant_id)
	cursor.execute(stmt, data)
	id = cursor.lastrowid
	con.commit()
	info = {"order_no" : order_no, "restaurant_id": restaurant_id, "feedback": feedback, "status": "success"}
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chef', methods=['POST', 'OPTIONS'])
def chef():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	chef_name = params['chef_name']
	owner_name = session['owner']
	restaurant_id = session['restaurant_id']
	stmt = "INSERT INTO CHEFS (chef_name, restaurant_id, rating ) VALUES (%s, %s, %s)"
	input = (chef_name, restaurant_id, "5")
	cursor.execute(stmt, input)
	id = cursor.lastrowid
	con.commit()	
	data = cursor.fetchall();
	info = [{"chef_name" : item[0], "owner_name":owner_name, "restaurant_id": item[1], "rating": item[2], "status": "success"} for item in data]
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chefs/<chef_id>', methods=['GET', 'OPTIONS'])
def chefname():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	stmt = "SELECT c.chef_id, c.chef_name, c.restaurant_id, f.feedback, f.rating as rating, c.rating as average_rating from FEEDBACK as f and CHEFS as c where c.chef_id=f.chef_id and c.chef_id=%s"
	input = (chef_id)
	cursor.execute(stmt, input)
	id = cursor.lastrowid
	con.commit()
	data = cursor.fetchall()
	temp = [{"feedback":item[3], "rating":item[4]} for item in data]
	chef_name=data[0][1]
	average_rating=data[0][5]
	info = {"chef_id" : chef_id, "chef_name": chef_name, "rating": average_rating, "feedback":temp}
	return Response(json.dumps(info),  mimetype='application/json')


@app.route('/order', methods=['POST', 'OPTIONS'])
def order():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	chef_name = params['chef_name']
	order_no=params['order_no']
	restaurant_id = session['restaurant_id']
	owner_name = session['owner_name']

	stmt = "INSERT INTO FEEDBACK (order_no, restaurant_id, chef_name, rating) VALUES (%s, %s, %s, %s, %s)"
	data = (order_no, restaurant_id, chef_name, "5")
	cursor.execute(stmt, data)
	id = cursor.lastrowid
	con.commit()
	info = {"chef_name" : chef_name, "owner_name":owner_name, "restaurant_id": restaurant_id, "order_no":order_no,  "status": "success"}
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chefs', methods=['GET', 'OPTIONS'])
def chefs():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	restaurant_id = session['restaurant_id']

	stmt = "SELECT c.chef_id, c.chef_name, c.rating from CHEFS as c where c.restaurant_id=%s"
	input = (restaurant_id)
	cursor.execute(stmt, input)
	id = cursor.lastrowid
	con.commit()
	data=cursor.fetchall();
	info = [{"chef_name" : item[0], "rating": item[1]} for item in data]
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

if __name__ == "__main__":
	# import logging
	# logging.basicConfig(filename='error.log',level=logging.DEBUG)
	app.debug=True
	app.run()