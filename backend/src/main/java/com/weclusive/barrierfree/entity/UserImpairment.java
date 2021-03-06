package com.weclusive.barrierfree.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
 
@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserImpairment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ui_seq")
	long uiSeq;

	@Column(name = "user_seq")
	int userSeq;

	String code;

	@Column(name = "del_yn")
	char delYn;

	@Column(name = "reg_dt")
	String regDt;

	@Column(name = "reg_id")
	String regId;

	@Column(name = "mod_dt")
	String modDt;

	@Column(name = "mod_id")
	String modId;

	@Builder
	public UserImpairment(int userSeq, String code, char delYn, String regDt, String regId, String modDt,
			String modId) {
		super();
		this.userSeq = userSeq;
		this.code = code;
		this.delYn = delYn;
		this.regDt = regDt;
		this.regId = regId;
		this.modDt = modDt;
		this.modId = modId;
	}

}
