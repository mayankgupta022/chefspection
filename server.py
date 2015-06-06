from flask import Flask, request, session, Response
from flaskext.mysql import MySQL
from flask.ext.cors import CORS
import json
from decimal import Decimal
from alchemyapi import AlchemyAPI
# from flask.ext.session import Session 

mysql = MySQL()
app = Flask(__name__)
cors = CORS(app)
alchemyapi = AlchemyAPI()
# sess = Session()

app.secret_key = 'super secret key'

app.config['MYSQL_DATABASE_USER'] = 'user'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pass'
app.config['MYSQL_DATABASE_DB'] = 'chefspection'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)

session = dict()

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

# response = alchemyapi.entities('text', params['text'], {'sentiment': 1})


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

	if request.method == 'POST':
		# log(json.stringify(params))
		restaurant_name=params['restaurant_name']
		stmt = "SELECT restaurant_id, owner FROM RESTAURANTS where restaurant_name=%s"
		input=(restaurant_name);
		cursor.execute(stmt, input)
		data = cursor.fetchone()		
		if data is None:
			info = {"status":"Log in failed."}
		else:
			info = {"status":"Logged in Successfully"}
			session['owner']=data[1]
			session['restaurant_id']=data[0]
			log(session['owner'])

	return Response(json.dumps(info), mimetype="application/json")
	
@app.route('/restaurant', methods=['GET', 'POST', 'OPTIONS'])
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

	if request.method == 'POST':
		order_no = params['order_no']
		restaurant_id = params['restaurant_id']
		feedback = params['feedback']
		response = alchemyapi.sentiment('text', params['feedback'])
		
		rating = Decimal(response["docSentiment"]["score"].strip(' "'))*10
		log(str(rating))
		stmt = "UPDATE FEEDBACK SET feedback =%s, rating =%s where order_no=%s and restaurant_id=%s"
		data = (feedback, rating, order_no, restaurant_id)
		cursor.execute(stmt, data)
		id = cursor.lastrowid
		con.commit()
		info = {"order_no" : order_no, "restaurant_id": restaurant_id, "feedback": feedback, "status": "success"}

		stmt = "SELECT AVG(rating) as average_rating from FEEDBACK where chef_id IN (SELECT chef_id from FEEDBACK where order_no=%s)"
		input = (order_no)
		cursor.execute(stmt, input)
		id = cursor.lastrowid
		con.commit()
		data=cursor.fetchone();

		stmt = "UPDATE CHEFS SET rating=%s where chef_id IN (SELECT chef_id from FEEDBACK where order_no=%s)"
		input = (data[0], order_no)
		cursor.execute(stmt, input)
		id = cursor.lastrowid
		con.commit()


	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chef', methods=['POST', 'OPTIONS'])
def chef():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	if request.method == 'POST':

		if not session:
			info = {"status": 1}
		else:
			chef_name = params['chef_name']
			owner = session['owner']
			restaurant_id = session['restaurant_id']
			stmt = "INSERT INTO CHEFS (chef_name, restaurant_id, rating ) VALUES (%s, %s, %s)"
			input = (chef_name, restaurant_id, "5")
			cursor.execute(stmt, input)
			id = cursor.lastrowid
			con.commit()	
			data = cursor.fetchall();
			info = [{"chef_name" : item[0], "owner":owner, "restaurant_id": item[1], "rating": item[2], "status": "success"} for item in data]
	
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chef/<chef_id>', methods=['GET', 'OPTIONS'])
def chefname(chef_id):
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	if request.method == 'GET':
		stmt = "SELECT c.chef_id, c.chef_name, c.restaurant_id, f.feedback, f.rating as rating, c.rating as average_rating from FEEDBACK as f, CHEFS as c where c.chef_id=f.chef_id and c.chef_id=%s"
		input = (chef_id)
		cursor.execute(stmt, input)
		data = cursor.fetchall()
		log(str(data))
		if data is None or len(data) == 0:
			stmt = "SELECT chef_name, rating FROM CHEFS where chef_id = %s"
			input = (chef_id)
			cursor.execute(stmt, input)
			data = cursor.fetchone()
			info = {"chef_id" : chef_id, "chef_name": data[0], "rating": str(data[1]), "feedback":[]}
		else:
			temp = [{"feedback":item[3], "rating":str(item[4])} for item in data]
			chef_name=data[0][1]
			average_rating=data[0][5]
			info = {"chef_id" : chef_id, "chef_name": chef_name, "rating": str(average_rating), "feedback":temp}
	
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')


@app.route('/order', methods=['POST', 'OPTIONS'])
def order():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	if request.method == 'POST':
		chef_id = params['chef_id']
		order_no=params['order_no']
		restaurant_id = session['restaurant_id']
		owner = session['owner']

		stmt = "INSERT INTO FEEDBACK (order_no, restaurant_id, chef_id, rating) VALUES (%s, %s, %s, %s)"
		data = (order_no, restaurant_id, chef_id, "5")
		cursor.execute(stmt, data)
		id = cursor.lastrowid
		con.commit()
		info = {"owner":owner, "restaurant_id": restaurant_id, "order_no":order_no,  "status": "success"}
	
	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

@app.route('/chefs', methods=['GET', 'OPTIONS'])
def chefs():
	params  = json.loads(json.dumps(request.json))

	con = mysql.connect()
	cursor = con.cursor()
	info = dict()

	if not session:
		info = {"status": 1}

	else:
		log(str(session['restaurant_id']))
		restaurant_id = session['restaurant_id']
		stmt = "SELECT c.chef_id, c.chef_name, c.rating from CHEFS as c where c.restaurant_id=%s"
		input = (restaurant_id)
		cursor.execute(stmt, input)
		id = cursor.lastrowid
		con.commit()
		data=cursor.fetchall();
		info = [{"chef_id" : item[0], "chef_name" : item[1], "rating": str(item[2])} for item in data]

	con.close()
	return Response(json.dumps(info),  mimetype='application/json')

if __name__ == "__main__":
	# import logging
	# logging.basicConfig(filename='error.log',level=logging.DEBUG)
	app.debug=True
	# app.secret_key = 'super secret key'
	app.config['SESSION_TYPE'] = 'filesystem'
	# sess.init_app(app)


	app.run()