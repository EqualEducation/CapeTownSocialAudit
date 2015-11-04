#bash generate_reports.sh

#environment
if [ ! $1 ]; then
        echo "Example of use: bash backup.sh production"
        exit 1
fi
env=$1

if [ $env != "local" ]; then
	echo "";
else
	echo "local"
	host=127.0.0.1:3001
	mongo_db=meteor
	user="ee"
	pass="ee"
fi;

if [ $env != "staging" ]; then
	echo "";
else
	echo "staging"
	host=production-db-a2.meteor.io:27017
	mongo_db=test_wcaudit_equaleducation_org_za
	user="ee"
	pass="ee"
fi;

if [ $env != "production" ]; then
	echo "";
else
	echo "production";
  host=production-db-a3.meteor.io:27017
  # production-db-a3.meteor.io:2701
	mongo_db=wc_audit_equaleducation_org_za
	user="ee"
	pass="ee"
fi;


mongodump --host $host -d $mongo_db --username $user --password $pass


# mongoimport -h $host -d $mongo_db -c videos -u $user -p $pass --file videos.json --jsonArray

# mongo $host/$mongo_db --eval "db.videos.find({})"
