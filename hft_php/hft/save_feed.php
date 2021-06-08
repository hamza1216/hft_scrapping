<?php
if($_SERVER['REQUEST_METHOD']=='POST'){

	include 'DatabaseConfig.php';

	$mysqli = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);

	if ($mysqli->connect_errno) {
		echo("Failed to connect to database");
		exit();
	}

	if(!isset($_POST["title"]) || !isset($_POST["url"]) || !isset($_POST["date"])){
		echo "invalid parameters";
		exit();
	}
	$title=$_POST["title"];
	$url=$_POST["url"];
	$date=$_POST["date"];

	$output = array();
	$sql = "SELECT * FROM feeds WHERE title='".$title."' AND url='".$url."' AND date='".$date."'";
	if ($result = $mysqli->query($sql)) {	
		if($result->num_rows > 0){
			$output['result'] = 'failed';
			$output['message'] = 'already existing';
		}
		else{
			$sql = "INSERT INTO feeds (title, url, date) VALUES ('".$title."', '".$url."','".$date."')";
			if($mysqli->query($sql) === TRUE){
				$output['result'] = 'success';
				$output['message'] = 'feed item is added.';
			}
			else{
				$output['result'] = 'failed';
				$output['message'] = 'failed to save feed item.';
			}
		}		
	}
	else{
		$output['result'] = 'failed';
	}
	echo json_encode($output);
	$result->close();
	$mysqli->close();
}
else {
	echo 'invalid method.';
}
?>