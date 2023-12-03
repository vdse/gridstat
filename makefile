se:
	(echo -ne "GET / HTTP/1.1\nHost: www.softevol.com\r\n\r\n") | nc www.softevol.com 80
#	printf 'GET / HTTP/1.1\r\nHost: softevol.com\r\nuser-agent: curl/7.81.0\r\naccept: */*\r\n\r\n' | ncat --ssl softevol.com 443
#	printf 'GET / HTTP/1.1\r\nHost: softevol.com\r\nuser-agent: curl/7.81.0\r\naccept: */*\r\n\r\n' | openssl s_client -connect softevol.com

gh:
	printf 'GET / HTTP/1.1\r\nHost: github.com\r\nuser-agent: curl/7.81.0\r\naccept: */*\r\n\r\n' | ncat --ssl github.com 443
