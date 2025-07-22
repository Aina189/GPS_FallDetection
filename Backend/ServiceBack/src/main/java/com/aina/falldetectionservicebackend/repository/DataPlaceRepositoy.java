package com.aina.falldetectionservicebackend.repository;

import com.aina.falldetectionservicebackend.entity.DataPLace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataPlaceRepositoy extends JpaRepository<DataPLace, String> {
    void getByTime(String time);
}
