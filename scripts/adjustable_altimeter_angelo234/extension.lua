-- This Source Code Form is subject to the terms of the bCDDL, v. 1.1.
-- If a copy of the bCDDL was not distributed with this
-- file, You can obtain one at http://beamng.com/bCDDL-1.1.txt

adjustable_altimeter_angelo234_new_map = true

local M = {}

local function onClientPreStartMission(mission)
	--need this so that default values don't get overriden while on same map
	--when restarting UI like when clicking on 'settings' UI
	adjustable_altimeter_angelo234_new_map = true
end


M.onClientPreStartMission = onClientPreStartMission

return M