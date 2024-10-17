-- app/lib/db/queries/insertIpponBashiCourse.sql
-- THE 一本橋のコースをID -1 に挿入する

INSERT INTO course (id, name, field, fieldvalid, mission, missionvalid, point) VALUES (-1, 'THE IpponBashi', 'route,route,route,route,route,route,route,route,route,start', TRUE, 'u;null;mf;1;mf;1;mf;1;mf;1;mf;1;mf;1;mf;1;mf;1;mf;1;mb;1;mb;1;mb;1;mb;1;mb;1;mb;1;mb;1;mb;1;mb;1', TRUE, '0;0;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1')

-- THE 一本橋のコースを更新する
UPDATE course SET field = 'route;route;route;route;start', mission = 'u;null;mf;1;mf;1;mf;1;mf;1;tr;180;mf;1;mf;1;mf;1;mf;1', point = '0;20;1;1;1;1;0;2;2;2;2' WHERE id = -1;





