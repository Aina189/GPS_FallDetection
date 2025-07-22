package com.aina.falldetectionservicebackend.service;

import com.aina.falldetectionservicebackend.dto.DataPlaceCreatDto;
import com.aina.falldetectionservicebackend.entity.DataPLace;
import com.aina.falldetectionservicebackend.repository.DataPlaceRepositoy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DataPlaceService {

    @Autowired
    DataPlaceRepositoy dataPlaceRepositoy;

    public List<DataPLace> getAllPLace(){
        return dataPlaceRepositoy.findAll();
    }

    public Optional<DataPLace> getPLaceById(String id){
        return dataPlaceRepositoy.findById(id);
    }

    public DataPLace newDataPlace(DataPlaceCreatDto dataPlaceCreatDto){
        DataPLace dataPLace = toEntity(dataPlaceCreatDto);
        return dataPlaceRepositoy.save(dataPLace);
    }

    private DataPLace toEntity(DataPlaceCreatDto dataPlaceCreatDto){
        DataPLace dataPLace = new DataPLace();
        dataPLace.setLongitude(dataPlaceCreatDto.getLongitude());
        dataPLace.setLatitude(dataPlaceCreatDto.getLatitude());
        dataPLace.setAlertType(dataPlaceCreatDto.getAlertType());
        dataPLace.setTime(dataPlaceCreatDto.getTime());
        return dataPLace;
    }

}
